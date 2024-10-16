import { createClient } from '@/lib/utils/supabase/server';
import { NextResponse } from 'next/server';

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

    return NextResponse.json({ message: 'Candidate profiles fetched successfully', data });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Failed to fetch candidate profiles data' }, { status: 500 });
  }
}