import { growthPackSchema, type BusinessInput, type GrowthPack } from '@shared/schema'
import { supabase } from './supabase'
import { createId } from './utils'

export type StoredGeneration = {
  id: string
  business: BusinessInput
  pack: GrowthPack
  source: 'openai' | 'sample'
  createdAt: string
}

const LOCAL_KEY = 'flarent-pulse:generations'

/* ------------------------------------------------------------------ *
 * Local mirror
 *
 * Every generation is written to localStorage regardless of backend, so a
 * refresh of /results/:id works even if Supabase is unreachable. Supabase,
 * when configured, is the durable copy and the one that works across devices.
 * ------------------------------------------------------------------ */

function readLocal(): Record<string, StoredGeneration> {
  try {
    const raw = localStorage.getItem(LOCAL_KEY)
    return raw ? (JSON.parse(raw) as Record<string, StoredGeneration>) : {}
  } catch {
    return {}
  }
}

function writeLocal(record: StoredGeneration) {
  try {
    const all = readLocal()
    all[record.id] = record
    // Keep only the 20 most recent packs so we never hit the storage quota.
    const trimmed = Object.values(all)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, 20)
    localStorage.setItem(
      LOCAL_KEY,
      JSON.stringify(Object.fromEntries(trimmed.map((item) => [item.id, item]))),
    )
  } catch {
    // Storage full or blocked (private mode) — Supabase or the in-memory
    // result still carries the session.
  }
}

/* ------------------------------------------------------------------ */

export async function saveGeneration(
  business: BusinessInput,
  pack: GrowthPack,
  source: 'openai' | 'sample',
): Promise<StoredGeneration> {
  const record: StoredGeneration = {
    id: createId(),
    business,
    pack,
    source,
    createdAt: new Date().toISOString(),
  }

  if (supabase) {
    try {
      const { data: businessRow, error: businessError } = await supabase
        .from('businesses')
        .insert({
          business_name: business.businessName,
          industry: business.industry,
          location: business.location,
          description: business.description,
          target_audience: business.targetAudience,
          goals: business.goals,
          website: business.website || null,
          instagram: business.instagram || null,
          additional_information: business.additionalInformation || null,
        })
        .select('id')
        .single()

      if (businessError) throw businessError

      const { data: generationRow, error: generationError } = await supabase
        .from('generations')
        .insert({
          business_id: businessRow.id,
          result_json: { pack, source, business },
        })
        .select('id, created_at')
        .single()

      if (generationError) throw generationError

      record.id = generationRow.id
      record.createdAt = generationRow.created_at ?? record.createdAt
    } catch (error) {
      // Persistence is best-effort: the user still gets their pack.
      console.error('[storage] Supabase write failed, using local storage only:', error)
    }
  }

  writeLocal(record)
  return record
}

export async function getGeneration(id: string): Promise<StoredGeneration | null> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('generations')
        .select('id, created_at, result_json')
        .eq('id', id)
        .maybeSingle()

      if (error) throw error

      if (data?.result_json) {
        const payload = data.result_json as {
          pack: unknown
          source?: 'openai' | 'sample'
          business: BusinessInput
        }
        const parsed = growthPackSchema.safeParse(payload.pack)
        if (parsed.success) {
          return {
            id: data.id,
            business: payload.business,
            pack: parsed.data,
            source: payload.source ?? 'openai',
            createdAt: data.created_at ?? new Date().toISOString(),
          }
        }
        console.error('[storage] stored pack failed validation, falling back to local copy')
      }
    } catch (error) {
      console.error('[storage] Supabase read failed, trying local copy:', error)
    }
  }

  const local = readLocal()[id]
  if (!local) return null

  const parsed = growthPackSchema.safeParse(local.pack)
  return parsed.success ? { ...local, pack: parsed.data } : null
}
