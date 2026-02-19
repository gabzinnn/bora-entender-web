import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('@BoraEntender:token')?.value;

    // Rotas que exigem autenticação
    const protectedRoutes = ['/admin', '/aluno', '/perfil'];

    // Verifica se a rota atual é protegida
    const isProtectedRoute = protectedRoutes.some(route =>
        request.nextUrl.pathname.startsWith(route)
    );

    // Se for rota protegida e não tiver token, redireciona para login
    if (isProtectedRoute && !token) {
        const loginUrl = new URL('/login', request.url);
        // Opcional: Salvar a URL de origem para redirecionar de volta após login
        loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Rotas de auth (login/cadastro) para redirecionar se já estiver logado
    const authRoutes = ['/login', '/cadastro'];
    const isAuthRoute = authRoutes.some(route =>
        request.nextUrl.pathname.startsWith(route)
    );

    if (isAuthRoute && token) {
        // Se já tem token e tenta acessar login, manda pra home ou dashboard
        // Por enquanto, vamos mandar para a home do aluno ou admin dependendo do caso, 
        // mas como o middleware não sabe o role facilmente sem decodificar o token, 
        // vamos mandar para uma rota genérica ou deixar passar se for logica de logout
        // Por simplificação, não vamos forçar redirect de saída de login agora, 
        // apenas proteção de entrada.
        // return NextResponse.redirect(new URL('/aluno', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/admin/:path*',
        '/aluno/:path*',
        '/perfil/:path*',
        // Adicione outras rotas que precisam de proteção
    ],
};
