import { AzureClientProps, AzureFunctionTokenProvider, LOCAL_MODE_TENANT_ID } from "@fluidframework/azure-client";
import { InsecureTokenProvider } from "@fluidframework/test-client-utils";

export const useAzure = process.env.REACT_APP_FLUID_CLIENT === "azure";

export const userConfig = {
    id: "1",
    name: "1445",
};


export const connectionConfig: AzureClientProps = useAzure ? { connection: {
    tenantId: "YOUR-TENANT-ID-HERE",
    tokenProvider: new AzureFunctionTokenProvider("AZURE-FUNCTION-URL" + "/api/GetAzureToken", { userId: "test-user", userName: "Test User" }),
    orderer: "ENTER-ORDERER-URL-HERE",
    storage: "ENTER-STORAGE-URL-HERE",
}} : { connection: {
    tenantId: LOCAL_MODE_TENANT_ID,
    tokenProvider: new InsecureTokenProvider("fooBar", userConfig),
    orderer: "http://localhost:7070",
    storage: "http://localhost:7070",
}} ;