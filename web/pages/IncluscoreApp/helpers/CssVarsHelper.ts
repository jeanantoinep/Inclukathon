export default class CssVarsHelper {
	public static getColorFromVariableName(colorName: string): string {
		const color = getComputedStyle(document.documentElement).getPropertyValue(colorName);
		if (color && color.trim() !== '') {
			return getComputedStyle(document.documentElement).getPropertyValue(colorName);
		}
		return '';
	}
}
