import { useAuthStore } from '@/stores/auth'

export default function authGuard(to, from, next) {

    const authStore = useAuthStore();
    const userType = authStore.userType; 

    const userRole = userType; 
    const allowedRoles = to.meta.allowedRoles; // Buscar dados ao campo meta: nas routes

    if (allowedRoles && !allowedRoles.includes(userRole)) {
        // Route se nao tiver permissoes
        next({ name: 'home' }); 
    } else {
        next(); 
    }
}