import { useAuthStore } from '@/stores/auth'



export default function authGuard(to, from, next) {
    // Assume user roles/permissions are stored in a Vuex store or a similar global state

    const authStore = useAuthStore(); // Access the auth store
const userType = authStore.userType; // Get the userType (e.g., "A" for admin)

    const userRole = userType; // e.g., 'admin', 'user', etc.
    const allowedRoles = to.meta.allowedRoles; // Defined in the route metadata

    if (allowedRoles && !allowedRoles.includes(userRole)) {
        // If the user role is not allowed, redirect or show an error
        next({ name: 'home' }); // Redirect to a "403 Forbidden" page
    } else {
        next(); // Allow access
    }
}