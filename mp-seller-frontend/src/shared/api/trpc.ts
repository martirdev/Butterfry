import {QueryClient} from '@tanstack/react-query';
import {httpBatchLink} from '@trpc/client';
import {createTRPCReact} from '@trpc/react-query';
import {useState} from 'react';

import type {Router} from '../../../../mp-seller-backend/src/routers';

export const trpc = createTRPCReact<Router>();

export const useTRPc = () => {
    const [queryClient] = useState(() => new QueryClient());
    const [trpcClient] = useState(() =>
        trpc.createClient({
            links: [
                httpBatchLink({
                    url: 'https://bba72hidpoe25c59h6h3.containers.yandexcloud.net/trpc'
                })
            ],
            transformer: undefined
        })
    );

    return {queryClient, trpcClient};
};
