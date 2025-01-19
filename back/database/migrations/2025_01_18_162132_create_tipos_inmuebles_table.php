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
            $table->bigInteger("id");
            $table->string('nombre_inmueble')->primary(true)->unique();
            $table->foreign('numero_identificacion')->on("usuarios")->references("numero_identificacion");
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
