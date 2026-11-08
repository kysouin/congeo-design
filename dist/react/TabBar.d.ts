import * as React from 'react';
export interface TabBarItem {
    key: string;
    label: React.ReactNode;
    /** A Lucide icon element, size 24. */
    icon: React.ReactNode;
    href?: string;
}
export interface TabBarProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onChange'> {
    /** Exactly four items. */
    items: [TabBarItem, TabBarItem, TabBarItem, TabBarItem] | TabBarItem[];
    value: string;
    onChange?: (key: string) => void;
    /** Render in flow instead of floating (for documentation). */
    inline?: boolean;
    label?: string;
}
/** Floating, safe-area aware tab bar with 4 items. */
export declare function TabBar({ items, value, onChange, inline, label, className, ...rest }: TabBarProps): React.JSX.Element;
/** Reserves space at the end of a scrolling screen so content is not hidden under the floating bar. */
export declare function TabBarSpacer(): React.JSX.Element;
