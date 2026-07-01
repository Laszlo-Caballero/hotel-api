import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.enableCors();
  app.setGlobalPrefix("api");

  const config = new DocumentBuilder()
    .setTitle("Hotel API")
    .setDescription("The Hotel API description")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, documentFactory);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Hotel API corriendo en: http://localhost:${port}/api`);
  console.log(`📚 Documentación Swagger en: http://localhost:${port}/api/docs`);
}
bootstrap();
