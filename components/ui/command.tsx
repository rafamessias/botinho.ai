"use client"

import * as React from "react"
import * as Cmdk from "cmdk"
import { cn } from "@/lib/utils"

const Command = React.forwardRef<
    React.ElementRef<typeof Cmdk.Command>,
    React.ComponentPropsWithoutRef<typeof Cmdk.Command>
>(({ className, ...props }, ref) => (
    <Cmdk.Command
        ref={ref}
        className={cn(
            "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
            className
        )}
        {...props}
    />
))
Command.displayName = "Command"

const CommandInput = React.forwardRef<
    React.ElementRef<typeof Cmdk.CommandInput>,
    React.ComponentPropsWithoutRef<typeof Cmdk.CommandInput>
>(({ className, ...props }, ref) => (
    <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
        <Cmdk.CommandInput
            ref={ref}
            className={cn(
                "flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
            {...props}
        />
    </div>
))
CommandInput.displayName = "CommandInput"

const CommandList = React.forwardRef<
    React.ElementRef<typeof Cmdk.CommandList>,
    React.ComponentPropsWithoutRef<typeof Cmdk.CommandList>
>(({ className, ...props }, ref) => (
    <Cmdk.CommandList
        ref={ref}
        className={cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className)}
        {...props}
    />
))
CommandList.displayName = "CommandList"

const CommandEmpty = React.forwardRef<
    React.ElementRef<typeof Cmdk.CommandEmpty>,
    React.ComponentPropsWithoutRef<typeof Cmdk.CommandEmpty>
>(({ className, ...props }, ref) => (
    <Cmdk.CommandEmpty
        ref={ref}
        className={cn("py-6 text-center text-sm", className)}
        {...props}
    />
))
CommandEmpty.displayName = "CommandEmpty"

const CommandGroup = React.forwardRef<
    React.ElementRef<typeof Cmdk.CommandGroup>,
    React.ComponentPropsWithoutRef<typeof Cmdk.CommandGroup>
>(({ className, ...props }, ref) => (
    <Cmdk.CommandGroup
        ref={ref}
        className={cn(
            "overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:text-muted-foreground",
            className
        )}
        {...props}
    />
))
CommandGroup.displayName = "CommandGroup"

const CommandItem = React.forwardRef<
    React.ElementRef<typeof Cmdk.CommandItem>,
    React.ComponentPropsWithoutRef<typeof Cmdk.CommandItem>
>(({ className, ...props }, ref) => (
    <Cmdk.CommandItem
        ref={ref}
        className={cn(
            "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
            className
        )}
        {...props}
    />
))
CommandItem.displayName = "CommandItem"

export { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } 