declare module '*.css' {
	const classes: { readonly [key: string]: string };
	export default classes;
}

declare module '@/styles/*.css' {
	const classes: { readonly [key: string]: string };
	export default classes;
}
