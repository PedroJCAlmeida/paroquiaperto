export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyJWT, getTokenFromRequest } from '@/lib/auth';
import type { Paroquia } from '@/types';

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const raio = searchParams.get('raio');

    const paroquias = await prisma.paroquia.findMany({
      include: { distrito: true, conselho: true, horarios: true, eventos: true },
    });

    let filtered: Paroquia[] = paroquias as Paroquia[];

    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.nome.toLowerCase().includes(s) ||
          (p.horarios && p.horarios.some((h) => h.tipo.toLowerCase().includes(s))),
      );
    }

    if (lat && lng && raio) {
      const userLat = parseFloat(lat);
      const userLng = parseFloat(lng);
      const radius = parseFloat(raio);

      filtered = filtered.filter((p) => {
        const pLat = parseFloat(p.lat);
        const pLng = parseFloat(p.lng);
        if (isNaN(pLat) || isNaN(pLng)) return false;
        const R = 6371;
        const dLat = ((pLat - userLat) * Math.PI) / 180;
        const dLng = ((pLng - userLng) * Math.PI) / 180;
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos((userLat * Math.PI) / 180) *
            Math.cos((pLat * Math.PI) / 180) *
            Math.sin(dLng / 2) *
            Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c;
        return d <= radius;
      });
    }

    return NextResponse.json(filtered);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const token = getTokenFromRequest(request);
    const payload = token ? await verifyJWT(token) : null;
    if (!payload) {
      return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
    }

    const data = (await request.json()) as Record<string, unknown>;
    const paroquia = await prisma.paroquia.create({
      data: {
        nome: data.nome as string,
        endereco: data.endereco as string,
        lat: String(data.lat),
        lng: String(data.lng),
        telefone: (data.telefone as string) || null,
        email: (data.email as string) || null,
        site: (data.site as string) || null,
        imagem: (data.imagem as string) || null,
        facebook: (data.facebook as string) || null,
        instagram: (data.instagram as string) || null,
        whatsapp: (data.whatsapp as string) || null,
        descricao: (data.descricao as string) || null,
        ...(data.distritoId ? { distrito: { connect: { id: parseInt(data.distritoId as string) } } } : {}),
        ...(data.conselhoId ? { conselho: { connect: { id: parseInt(data.conselhoId as string) } } } : {}),
      },
      include: { distrito: true, conselho: true },
    });
    return NextResponse.json(paroquia, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 });
  }
}
