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
        Schema::create('inmuebles', function (Blueprint $table) {
         
            
            $table->string("nombre_inmueble");
            $table->string("codigo_proyecto");
            $table->string("nombre_tipo_inmueble");
            $table->string("estado")->default("Activo");
            
            $table->primary(["nombre_inmueble","codigo_proyecto"]);

            $table->foreign("nombre_tipo_inmueble")->references("nombre_tipo_inmueble")->on("tipos_inmuebles");
            $table->foreign("codigo_proyecto")->references("codigo_proyecto")->on("proyectos");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inmuebles');
    }
};
