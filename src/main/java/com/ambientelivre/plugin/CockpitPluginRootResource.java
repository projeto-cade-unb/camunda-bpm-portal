package com.ambientelivre.plugin;

import java.util.List;

import javax.websocket.server.PathParam;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.camunda.bpm.cockpit.plugin.resource.AbstractCockpitPluginRootResource;

import com.ambientelivre.plugin.service.ProcessDefinitionDocumentationService;

@Path("plugin/" + CockpitPlugin.ID)
@Produces(MediaType.APPLICATION_JSON)
public class CockpitPluginRootResource extends AbstractCockpitPluginRootResource {
  private static final String ENGINE_NAME = "default";

  public CockpitPluginRootResource() {
    super(CockpitPlugin.ID);
  }

  @GET
  @Path("process-definition")
  public List<ProcessDefinitionDocumentation> findManyProcessDefinitionDocumentation() {
    return subResource(new ProcessDefinitionDocumentationService(ENGINE_NAME), ENGINE_NAME)
        .findManyProcessDefinitionDocumentation();
  }

  @GET
  @Path("process-definition/{processDefinitionKey}")
  public ProcessDefinitionDocumentation findOneProcessDefinitionDocumentation(
      @PathParam("processDefinitionKey") String processDefinitionKey) {
    return subResource(new ProcessDefinitionDocumentationService(ENGINE_NAME), ENGINE_NAME)
        .findOneProcessDefinitionDocumentation(processDefinitionKey);
  }

  @Override
  protected List<String> getAllowedAssets() {
    return List.of(
        "app/plugin.js",
        "app/plugin.css",
        "app/styles.css",
        "app/main.js",
        "app/polyfills.js",
        "app/index.html",
        "app/media/Inter-roman.var.woff2");
  }
}
