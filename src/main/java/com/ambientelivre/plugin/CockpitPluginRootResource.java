package com.ambientelivre.plugin;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.camunda.bpm.cockpit.plugin.resource.AbstractCockpitPluginRootResource;
import org.camunda.bpm.engine.rest.exception.RestException;

import com.ambientelivre.plugin.dto.ProcessDefinitionDocumentationAuthorizationDto;
import com.ambientelivre.plugin.service.ProcessDefinitionDocumentationService;

@Path("plugin/" + CockpitPlugin.ID)
public class CockpitPluginRootResource extends AbstractCockpitPluginRootResource {
  private static final String ENGINE_NAME = "default";
  private ProcessDefinitionDocumentationService processDefinitionDocumentationService;

  public CockpitPluginRootResource() {
    super(CockpitPlugin.ID);
    processDefinitionDocumentationService = subResource(new ProcessDefinitionDocumentationService(ENGINE_NAME),
        ENGINE_NAME);
  }

  @GET
  @Path("/static/{file:.*}")
  public Response index(@Context HttpServletRequest request) {
    String path = request.getPathInfo().replace("/plugin/" + CockpitPlugin.ID + "/static/app", "");

    try {
      Response response = getAsset("app" + path);
      if (response.getStatus() == 404 || response.getStatus() == 403) {
        return getAsset("app/index.html");
      }

      return response;
    } catch (RestException e) {
      return getAsset("app/index.html");
    }
  }

  @GET
  @Path("/static/app")
  public Response index() {
    return getAsset("app/index.html");
  }

  @GET
  @Path("process-definition")
  @Produces(MediaType.APPLICATION_JSON)
  public ProcessDefinitionDocumentationAuthorizationDto findManyProcessDefinitionDocumentation(
      @QueryParam("processDefinitionKey") String processDefinitionKey) {
    return processDefinitionDocumentationService.findManyProcessDefinitionDocumentation(processDefinitionKey);
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
        "app/media/Inter-roman.var.woff2",
        "app/assets/i18n/en.json",
        "app/assets/i18n/pt.json",
        "app/assets/i18n/es.json",
        "app/assets/i18n/de.json");
  }
}
