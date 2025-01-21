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
         
            $table->id();
            $table->string("nombre_inmueble")->index();
            $table->string("estado",1)->default("A");
         
            $table->string("codigo_proyecto", 10);
            
            $table->foreignId("tipo_inmueble")->references("id")->on("tipos_inmuebles");
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
