'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@isaacdex/db'
import { mojGracz } from '@/lib/konto'

/**
 * Zagadka Sekretnego Pokoju. Odpowiedź jest sprawdzana WYŁĄCZNIE tu, na serwerze — nie ma jej
 * w bundlu przeglądarki, więc sekret zostaje sekretem (nie da się go „podejrzeć w źródle").
 *
 * Odpowiedź to imię sklepikarza, który sam jest walutą — „Keeper". Sprawdzamy pobłażliwie:
 * bierzemy same litery i pytamy, czy pada w nich „keeper" (łapie „Keeper", „the keeper",
 * „KEEPER!" itd.). Wynik wraca w ADRESIE (?blad=1), jak w logowaniu — przeżywa przemontowanie
 * i działa bez JS.
 */
function poprawna(odp: string): boolean {
  return odp
    .toLowerCase()
    .replace(/[^a-z]/g, '')
    .includes('keeper')
}

export async function sprawdzSekret(dane: FormData) {
  const ja = await mojGracz()
  // Sekretów nie ma komu nadawać gościowi — najpierw konto.
  if (!ja) redirect('/logowanie')

  const odp = String(dane.get('odpowiedz') ?? '')
  if (!poprawna(odp)) redirect('/sekret?blad=1')

  // Idempotentnie: drugi raz nic nie zmienia, ale i tak wpuszczamy na ekran nagrody.
  if (!ja.sekretOdkryty) {
    await prisma.gracz.update({ where: { id: ja.id }, data: { sekretOdkryty: true } })
    // Tytuł „Keeper" wchodzi do puli odznak (nagłówek profilu, Pulpit) — te renderuje layout.
    revalidatePath('/', 'layout')
  }
  redirect('/sekret?ok=1')
}
