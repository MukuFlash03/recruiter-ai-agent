import { createClient } from '@/lib/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('Error exchanging code for session:', error);
      return NextResponse.redirect(new URL('/error', request.url));
    }

    const { user } = data;

    // console.log("Inside if code before if user");
    // console.log('User:', user);


    if (user) {
      try {
        // First check if user exists
        const { data: existingUser, error: fetchError } = await supabase
          .from('bw_users')
          .select('user_id')
          .eq('user_id', user.id)
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "not found" error
          console.error('Error checking existing user:', fetchError);
          throw fetchError;
        }

        // console.log("About to create user in callback route");
        // console.log("Existing user:", existingUser);
        // console.log("***********************\n\n");
        // console.log("Retrieved user via code exchange:", user);

        if (!existingUser) {
          const { data: insertUserData, error: insertUserError } = await supabase
            .from('bw_users')
            .insert({
              user_id: user.id,
              email: user.email ?? 'no-user@email.com',
              name: user.user_metadata.full_name || user.email || 'Unknown User',
            });

          if (insertUserError) {
            console.error('Error creating user:', insertUserError)
          }
        }

        // Only create user if they don't exist
        // if (!existingUser) {
        //   // await createUserGoogle({
        //   await createUser({
        //     user_id: user.id,
        //     email: user.email ?? 'no-user@email.com',
        //     name: user.user_metadata.full_name || user.email || 'Unknown User',
        //     // code: code,
        //   });
        // }

        // console.log("Making call to create-user route from callback route");
        // await createUserGoogle({
        //   code: code,
        // });

        return NextResponse.redirect(new URL('/', request.url));
      } catch (error) {
        console.error('Error in user creation process:', error);
        return NextResponse.redirect(new URL('/error', request.url));
      }
    }
  }

  // If there's no code or user, redirect to the login page
  return NextResponse.redirect(new URL('/login', request.url));
}
