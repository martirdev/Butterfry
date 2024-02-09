import {Outlet, ScrollRestoration} from 'react-router-dom';

import {Header} from '_widgets/header';

const ClientRoot = function ClientRoot() {
    return (
        <>
            <div className="relative z-0 min-h-screen overflow-hidden">
                <Header />
                <Outlet />
            </div>
            <ScrollRestoration />
        </>
    );
};

export default ClientRoot;
