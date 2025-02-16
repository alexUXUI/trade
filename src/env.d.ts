/// <reference types="@rsbuild/core/types" />

interface ImportMetaEnv {
    readonly PUBLIC_AUTH0_DOMAIN: string;
    readonly PUBLIC_AUTH0_CLIENT_ID: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}