import { createClient } from '@/lib/utils/supabase/server';
import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const candidate_id = user?.id;

    const { data, error } = await supabase
      .from('candidate_profiles')
      .select()
      .eq('candidate_id', candidate_id);

    if (error) throw error;

    console.log('Fetched candidate profile data');


    return NextResponse.json({ message: 'Candidate profile fetched successfully', data });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Failed to fetch candidate profile data' }, { status: 500 });
  }
}