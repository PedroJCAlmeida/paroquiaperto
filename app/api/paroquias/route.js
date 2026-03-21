export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyJWT, getTokenFromRequest } from '@/lib/auth';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const raio = searchParams.get('raio');

    const paroquias = await prisma.paroquia.findMany({
      include: { distrito: true, conselho: true, horarios: true, eventos: true }
    });

    let filtered = paroquias;

    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(p =>
        p.nome.toLowerCase().includes(s) ||
        (p.horarios && p.horarios.some(h => h.tipo.toLowerCase().includes(s)))
      );
    }

    if (lat && lng && raio) {
      const userLat = parseFloat(lat);
      const userLng = parseFloat(lng);
      const radius = parseFloat(raio);

      filtered = filtered.filter(p => {
        const pLat = parseFloat(p.lat);
        const pLng = parseFloat(p.lng);
        if (isNaN(pLat) || isNaN(pLng)) return false;
        const R = 6371;
        const dLat = (pLat - userLat) * Math.PI / 180;
        const dLng = (pLng - userLng) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(userLat * Math.PI / 180) * Math.cos(pLat * Math.PI / 180) *
          Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
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

export async function POST(request) {
  try {
    const token = getTokenFromRequest(request);
    const payload = token ? await verifyJWT(token) : null;
    if (!payload) {
      return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
    }

    const data = await request.json();
    const paroquia = await prisma.paroquia.create({
      data: {
        nome: data.nome,
        endereco: data.endereco,
        lat: String(data.lat),
        lng: String(data.lng),
        telefone: data.telefone || null,
        email: data.email || null,
        site: data.site || null,
        imagem: data.imagem || null,
        facebook: data.facebook || null,
        instagram: data.instagram || null,
        whatsapp: data.whatsapp || null,
        descricao: data.descricao || null,
        ...(data.distritoId && { distrito: { connect: { id: parseInt(data.distritoId) } } }),
        ...(data.conselhoId && { conselho: { connect: { id: parseInt(data.conselhoId) } } }),
      },
      include: { distrito: true, conselho: true }
    });
    return NextResponse.json(paroquia, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 });
  }
}
