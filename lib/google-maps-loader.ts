type GoogleMapsNamespace = typeof google

let loaderPromise: Promise<GoogleMapsNamespace> | null = null

const getApiKey = (): string | undefined =>
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
    undefined

const waitForPlacesLibrary = async (): Promise<GoogleMapsNamespace> => {
    if (!window.google?.maps) {
        throw new Error("Google Maps failed to initialize")
    }

    await window.google.maps.importLibrary("places")
    return window.google
}

export const loadGoogleMaps = (): Promise<GoogleMapsNamespace> => {
    if (typeof window === "undefined") {
        return Promise.reject(new Error("Google Maps can only load in the browser"))
    }

    if (window.google?.maps?.places?.Autocomplete) {
        return Promise.resolve(window.google)
    }

    if (loaderPromise) {
        return loaderPromise
    }

    const apiKey = getApiKey()
    if (!apiKey) {
        return Promise.reject(new Error("Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY"))
    }

    loaderPromise = new Promise((resolve, reject) => {
        const finish = () => {
            waitForPlacesLibrary().then(resolve).catch(reject)
        }

        const existingScript = document.querySelector<HTMLScriptElement>(
            'script[data-google-maps="true"]',
        )

        if (existingScript) {
            if (existingScript.dataset.loaded === "true") {
                finish()
                return
            }

            existingScript.addEventListener(
                "load",
                () => {
                    existingScript.dataset.loaded = "true"
                    finish()
                },
                { once: true },
            )
            existingScript.addEventListener(
                "error",
                () => reject(new Error("Failed to load Google Maps")),
                { once: true },
            )
            return
        }

        const script = document.createElement("script")
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
        script.async = true
        script.defer = true
        script.dataset.googleMaps = "true"
        script.onload = () => {
            script.dataset.loaded = "true"
            finish()
        }
        script.onerror = () => reject(new Error("Failed to load Google Maps"))
        document.head.appendChild(script)
    })

    return loaderPromise
}
