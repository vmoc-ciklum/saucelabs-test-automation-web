/**
 * Contract checks for the web app manifest the Swag Labs deployment publishes at
 * /manifest.json.
 *
 * The UI specs in this suite exercise the rendered app; these exercise the JSON
 * payload it serves. The manifest is a genuine published contract — the browser
 * reads it to decide the install name, the theme colour and the icon set — so a
 * silent change to its shape is a real integration break, not a cosmetic one.
 *
 * Everything the check needs lives in this file on purpose. When a field is
 * renamed upstream the whole repair is one file: the type, the expectation and
 * the reader move together.
 */

interface ManifestIcon {
    src: string;
    sizes: string;
    type: string;
}

interface AppManifest {
    name: string;
    short_name: string;
    scope: string;
    start_url: string;
    display: string;
    theme_color: string;
    background_color: string;
    icons: ManifestIcon[];
}

interface ManifestResponse {
    status: number;
    contentType: string;
    body: AppManifest;
}

const MANIFEST_PATH = '/manifest.json';

async function fetchAppManifest(): Promise<ManifestResponse> {
    const response = await fetch(`${browser.options.baseUrl}${MANIFEST_PATH}`);

    return {
        status: response.status,
        contentType: response.headers.get('content-type') || '',
        body: (await response.json()) as AppManifest,
    };
}

describe('App manifest contract', () => {
    it('should serve the manifest as JSON', async () => {
        const {status, contentType} = await fetchAppManifest();

        await expect(status).toEqual(200);
        await expect(contentType).toContain('application/json');
    });

    it('should publish the documented application identity', async () => {
        const {body} = await fetchAppManifest();

        await expect(body.name).toEqual('Swag Labs');
        await expect(body.short_name).toEqual('Swag Labs');
        await expect(body.scope).toEqual('/');
    });

    it('should publish the documented display and icon contract', async () => {
        const {body} = await fetchAppManifest();

        await expect(body.display).toEqual('browser');
        await expect(body.start_url).toEqual('/.');

        await expect(body.icons).toHaveLength(4);

        for (const icon of body.icons) {
            await expect(icon.src).toContain('/icon-');
            await expect(icon.sizes).toMatch(/^\d+x\d+$/);
            await expect(icon.type).toEqual('image/png');
        }
    });
});
