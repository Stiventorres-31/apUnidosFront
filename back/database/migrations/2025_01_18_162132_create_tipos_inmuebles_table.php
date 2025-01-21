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
        Schema::create('tipos_inmuebles', function (Blueprint $table) {
            $table->id();
            $table->string('nombre_tipo_inmueble'); 
            $table->string('numero_identificacion'); 
            $table->char("estado",1)->default("A");
            $table->foreign('numero_identificacion')->references("numero_identificacion")->on("usuarios");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tipos_inmuebles');
    }
};
