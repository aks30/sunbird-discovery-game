
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, score, photo, date } = body;

        // Basic Validation
        if (!name || !email) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const dataDir = path.join(process.cwd(), 'data');
        const filePath = path.join(dataDir, 'users.json');

        // Ensure data directory exists
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }

        let users = [];
        if (fs.existsSync(filePath)) {
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            try {
                users = JSON.parse(fileContent);
            } catch (e) {
                console.error('Error parsing users.json:', e);
                users = [];
            }
        }

        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            score,
            date,
            // Not storing photo to avoid huge file sizes
            photoStored: !!photo
        };

        users.push(newUser);

        fs.writeFileSync(filePath, JSON.stringify(users, null, 2));

        return NextResponse.json({ success: true, message: 'Data saved locally' });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
