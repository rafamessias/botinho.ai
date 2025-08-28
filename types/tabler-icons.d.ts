declare module '@tabler/icons-react' {
    import { ComponentType, SVGProps } from 'react'

    export interface TablerIconProps extends SVGProps<SVGSVGElement> {
        size?: string | number
        stroke?: string | number
        color?: string
        fill?: string
    }

    export type TablerIcon = ComponentType<TablerIconProps>

    // Export all the icons used in the project
    export const IconCamera: TablerIcon
    export const IconChartBar: TablerIcon
    export const IconDashboard: TablerIcon
    export const IconDatabase: TablerIcon
    export const IconFileAi: TablerIcon
    export const IconFileDescription: TablerIcon
    export const IconFileWord: TablerIcon
    export const IconFolder: TablerIcon
    export const IconHelp: TablerIcon
    export const IconInnerShadowTop: TablerIcon
    export const IconListDetails: TablerIcon
    export const IconReport: TablerIcon
    export const IconSettings: TablerIcon
    export const IconUsers: TablerIcon
    export const IconCirclePlusFilled: TablerIcon
    export const IconMail: TablerIcon
    export const IconTrendingDown: TablerIcon
    export const IconTrendingUp: TablerIcon
    export const IconCreditCard: TablerIcon
    export const IconDotsVertical: TablerIcon
    export const IconLogout: TablerIcon
    export const IconNotification: TablerIcon
    export const IconUserCircle: TablerIcon
    export const IconSearch: TablerIcon
}
