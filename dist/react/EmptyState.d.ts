import * as React from 'react';
export interface EmptyStateProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
    /** A Lucide icon element, size 24. */
    icon?: React.ReactNode;
    title: React.ReactNode;
    text?: React.ReactNode;
    action?: React.ReactNode;
}
export declare function EmptyState({ icon, title, text, action, className, ...rest }: EmptyStateProps): React.JSX.Element;
