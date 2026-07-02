export type ParsedGoogleAddress = {
    address: string
    addressNumber: string
    city: string
    state: string
    zipCode: string
}

const getAddressComponent = (
    components: google.maps.GeocoderAddressComponent[],
    type: string,
    useShortName = false,
): string => {
    const match = components.find((component) => component.types.includes(type))
    if (!match) return ""
    return useShortName ? match.short_name : match.long_name
}

export const parseGooglePlaceAddress = (
    place: google.maps.places.PlaceResult,
): ParsedGoogleAddress => {
    const components = place.address_components ?? []
    const streetNumber = getAddressComponent(components, "street_number")
    const route = getAddressComponent(components, "route")
    const city =
        getAddressComponent(components, "locality") ||
        getAddressComponent(components, "administrative_area_level_2")
    const state = getAddressComponent(components, "administrative_area_level_1", true)
    const zipCode = getAddressComponent(components, "postal_code")

    const address =
        route ||
        place.formatted_address?.split(",")[0]?.trim() ||
        ""

    return {
        address,
        addressNumber: streetNumber,
        city,
        state,
        zipCode,
    }
}
