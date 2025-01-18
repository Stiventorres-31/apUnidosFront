<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('proyectos', function (Blueprint $table) {
            $table->id();
            $table->string('codigo_proyecto');
            $table->string('nombre_proyecto');
            $table->string('departamento_proyecto');
            $table->string('ciudad_municipio_proyecto');
            $table->string('direccion_proyecto');
            $table->date('fecha_inicio_proyecto');
            $table->date('fecha_final_proyecto');
            $table->foreignId('numero_identificacion')->on("usuarios")->references("numero_identificacion");
            $table->string("estado")->default("Activo");  
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('proyectos');
    }
};
