package com.ambientelivre.plugin;

import java.util.List;

import javax.ws.rs.Path;

import org.camunda.bpm.cockpit.plugin.resource.AbstractCockpitPluginRootResource;

@Path("plugin/" + CockpitPlugin.ID)
public class CockpitPluginRootResource extends AbstractCockpitPluginRootResource {
  public CockpitPluginRootResource() {
    super(CockpitPlugin.ID);
  }

  @Override
  protected List<String> getAllowedAssets() {
    return List.of(
        "app/plugin.js",
        "app/plugin.css",
        "app/index.html",
        "app/media/Inter-roman.var.woff2");
  }
}
