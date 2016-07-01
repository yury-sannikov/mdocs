
export function* render(ctx, locals) {
  if (__DEVELOPMENT__) {
    webpackIsomorphicTools.refresh();
  }
  ctx.render('app/dashboardReact', Object.assign({}, locals, {
    assets: webpackIsomorphicTools.assets()
  }), true);

}
