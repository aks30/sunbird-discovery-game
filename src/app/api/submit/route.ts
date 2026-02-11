import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
    try {
        const { data, error } = await supabase
            .from('sunbird_discovery_game_users')
            .select('*')
            .order('id', { ascending: false });

        if (error) throw error;
        return NextResponse.json(data || []);
    } catch (error) {
        console.error('Supabase GET Error:', error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, score, photo, date } = body;

        // Basic Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!name || !email || !emailRegex.test(email)) {
            return NextResponse.json({ error: 'Invalid or missing fields' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('sunbird_discovery_game_users')
            .insert([
                {
                    name,
                    email,
                    score,
                    date,
                    photo_stored: !!photo
                }
            ]);

        if (error) throw error;

        return NextResponse.json({ success: true, message: 'Data saved to Supabase' });

    } catch (error: any) {
        console.error('Supabase POST Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
