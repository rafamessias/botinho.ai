"use client"

import React, { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatPhoneNumber, extractPhoneDigits, countries, CountryCode, Country, parseInternationalNumber, buildInternationalNumber } from "@/lib/phone-utils"

interface PhoneInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
    value?: string // Can be international number (e.g., "+5511999999999") or local number
    onChange?: (value: string) => void // Returns international number
    onFormattedChange?: (formattedValue: string) => void // Returns formatted local number
    onCountryChange?: (country: Country) => void
    defaultCountry?: CountryCode
}

export const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
    ({ value = "", onChange, onFormattedChange, onCountryChange, defaultCountry = 'BR', ...props }, ref) => {
        const [displayValue, setDisplayValue] = useState("")
        const [selectedCountry, setSelectedCountry] = useState<Country>(() =>
            countries.find(c => c.code === defaultCountry) || countries[0]
        )
        const [open, setOpen] = useState(false)

        // Update display value when external value changes (e.g., from server)
        useEffect(() => {
            if (value !== undefined) {
                // Check if value is an international number
                const parsed = parseInternationalNumber(value)

                if (parsed) {
                    // It's an international number, set country and local number
                    const country = countries.find(c => c.code === parsed.countryCode)
                    if (country) {
                        setSelectedCountry(country)
                        const formatted = formatPhoneNumber(parsed.localNumber, parsed.countryCode)
                        setDisplayValue(formatted)
                    }
                } else {
                    // It's a local number, format with current country
                    const formatted = formatPhoneNumber(value, selectedCountry.code)
                    setDisplayValue(formatted)
                }
            }
        }, [value, selectedCountry.code])

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const inputValue = e.target.value
            const formattedValue = formatPhoneNumber(inputValue, selectedCountry.code)

            // Limit to maximum length based on selected country
            if (formattedValue.length <= selectedCountry.maxLength) {
                setDisplayValue(formattedValue)

                // Extract only digits for building international number
                const digitsOnly = extractPhoneDigits(formattedValue)

                // Build international number for database storage
                const internationalNumber = buildInternationalNumber(selectedCountry.code, digitsOnly)

                // Call onChange with international number for database storage
                onChange?.(internationalNumber)

                // Call onFormattedChange with formatted local value if needed
                onFormattedChange?.(formattedValue)
            }
        }

        const handleCountrySelect = (country: Country) => {
            setSelectedCountry(country)
            setOpen(false)

            // Reformat current value with new country format
            const digitsOnly = extractPhoneDigits(displayValue)
            const newFormattedValue = formatPhoneNumber(digitsOnly, country.code)
            setDisplayValue(newFormattedValue)

            // Build new international number with new country
            const internationalNumber = buildInternationalNumber(country.code, digitsOnly)
            onChange?.(internationalNumber)

            // Notify parent component about country change
            onCountryChange?.(country)
        }

        return (
            <div className="flex">
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-[120px] justify-between border-r-0 rounded-r-none"
                        >
                            <span className="flex items-center gap-2">
                                <span>{selectedCountry.flag}</span>
                                <span className="text-sm">{selectedCountry.dialCode}</span>
                            </span>
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                        <Command>
                            <CommandInput placeholder="Search country..." />
                            <CommandList>
                                <CommandEmpty>No country found.</CommandEmpty>
                                <CommandGroup>
                                    {countries.map((country) => (
                                        <CommandItem
                                            key={country.code}
                                            value={country.name}
                                            onSelect={() => handleCountrySelect(country)}
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    selectedCountry.code === country.code ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            <span className="mr-2">{country.flag}</span>
                                            <span className="mr-2">{country.name}</span>
                                            <span className="text-muted-foreground">{country.dialCode}</span>
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
                <Input
                    ref={ref}
                    {...props}
                    value={displayValue}
                    onChange={handleChange}
                    placeholder={selectedCountry.placeholder}
                    maxLength={selectedCountry.maxLength}
                    className="rounded-l-none border-l-0"
                />
            </div>
        )
    }
)

PhoneInput.displayName = "PhoneInput"
