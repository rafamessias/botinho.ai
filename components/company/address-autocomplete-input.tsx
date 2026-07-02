"use client"

import { useEffect, useRef, useState } from "react"
import { X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { loadGoogleMaps } from "@/lib/google-maps-loader"
import { parseGooglePlaceAddress, type ParsedGoogleAddress } from "@/lib/parse-google-address"

type AddressAutocompleteInputProps = {
    id: string
    value: string
    disabled?: boolean
    placeholder?: string
    countryIso?: string
    clearLabel?: string
    "aria-required"?: boolean
    onValueChange: (value: string) => void
    onPlaceSelected: (parsed: ParsedGoogleAddress) => void
    onClear: () => void
}

export const AddressAutocompleteInput = ({
    id,
    value,
    disabled = false,
    placeholder,
    countryIso,
    clearLabel,
    "aria-required": ariaRequired,
    onValueChange,
    onPlaceSelected,
    onClear,
}: AddressAutocompleteInputProps) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)
    const onPlaceSelectedRef = useRef(onPlaceSelected)
    const onValueChangeRef = useRef(onValueChange)
    const lastSyncedValueRef = useRef(value)
    const isFocusedRef = useRef(false)
    const [hasText, setHasText] = useState(Boolean(value))

    useEffect(() => {
        onPlaceSelectedRef.current = onPlaceSelected
        onValueChangeRef.current = onValueChange
    }, [onPlaceSelected, onValueChange])

    useEffect(() => {
        const input = inputRef.current
        if (!input) return

        if (value === lastSyncedValueRef.current) return

        input.value = value
        lastSyncedValueRef.current = value
        setHasText(Boolean(value))
    }, [value])

    useEffect(() => {
        if (disabled || !inputRef.current) return

        let cancelled = false

        loadGoogleMaps()
            .then((googleMaps) => {
                if (cancelled || !inputRef.current) return

                autocompleteRef.current?.unbindAll()
                autocompleteRef.current = new googleMaps.maps.places.Autocomplete(inputRef.current, {
                    fields: ["address_components", "formatted_address"],
                    ...(countryIso ? { componentRestrictions: { country: countryIso } } : {}),
                })

                autocompleteRef.current.addListener("place_changed", () => {
                    const place = autocompleteRef.current?.getPlace()
                    if (!place) return

                    const parsed = parseGooglePlaceAddress(place)
                    const nextValue = parsed.address || inputRef.current?.value || ""
                    if (inputRef.current) {
                        inputRef.current.value = nextValue
                    }
                    lastSyncedValueRef.current = nextValue
                    onValueChangeRef.current(nextValue)
                    onPlaceSelectedRef.current(parsed)
                })
            })
            .catch((error) => {
                console.warn("Google Places autocomplete unavailable:", error)
            })

        return () => {
            cancelled = true
            autocompleteRef.current?.unbindAll()
            autocompleteRef.current = null
        }
    }, [countryIso, disabled])

    const handleInput = () => {
        const nextValue = inputRef.current?.value ?? ""
        setHasText(Boolean(nextValue))
        lastSyncedValueRef.current = nextValue
        onValueChangeRef.current(nextValue)
    }

    const handleBlur = () => {
        isFocusedRef.current = false
        const nextValue = inputRef.current?.value ?? ""
        lastSyncedValueRef.current = nextValue
        onValueChange(nextValue)
    }

    const handleClear = () => {
        if (inputRef.current) {
            inputRef.current.value = ""
        }
        lastSyncedValueRef.current = ""
        setHasText(false)
        onClear()
    }

    return (
        <div className="relative">
            <Input
                ref={inputRef}
                id={id}
                disabled={disabled}
                placeholder={placeholder}
                className="pr-10"
                defaultValue={value}
                aria-required={ariaRequired}
                onFocus={() => {
                    isFocusedRef.current = true
                }}
                onBlur={handleBlur}
                onInput={handleInput}
                autoComplete="off"
            />
            {hasText && !disabled && (
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 size-7 -translate-y-1/2"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={handleClear}
                    aria-label={clearLabel}
                >
                    <X className="size-4" aria-hidden="true" />
                </Button>
            )}
        </div>
    )
}
