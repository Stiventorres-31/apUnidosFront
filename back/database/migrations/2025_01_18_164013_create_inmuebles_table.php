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
            $table->string("nombre_inmueble")->unique();
            $table->string("estado")->default("Activo");
            $table->foreign("tipo_inmueble_id")->on("tipos_inmuebles")->references("id");
            $table->foreign("codigo_proyecto")->on("proyectos ")->references("codigo_proyecto");
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
