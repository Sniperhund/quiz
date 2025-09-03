import { Outlet, createRootRoute } from "@tanstack/react-router"
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools"
import { TanstackDevtools } from "@tanstack/react-devtools"
import { Toaster } from "sonner"

export const Route = createRootRoute({
    component: () => (
        <>
            <Outlet />
            <Toaster />
            <TanstackDevtools
                config={{
                    position: "bottom-left",
                }}
                plugins={[
                    {
                        name: "Tanstack Router",
                        render: <TanStackRouterDevtoolsPanel />,
                    },
                ]}
            />
        </>
    ),
})
