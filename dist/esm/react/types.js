export function accentAttrs(accent) {
    if (!accent)
        return {};
    if ('tool' in accent && accent.tool)
        return { 'data-tool': accent.tool };
    if ('status' in accent && accent.status)
        return { 'data-status': accent.status };
    return {};
}
