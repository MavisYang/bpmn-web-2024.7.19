<template>
    <div>
        <draggable 
            :list="list"
             item-key="name"
        class="list-group"
        >
            <template #item="{ element}">
                 <div class="list-group-item">
                    {{ element.name }}
                </div>
            </template>
        </draggable>
    </div>
</template>
<script lang="ts" setup>
import draggable from "vuedraggable";

const list = [{ name: "John", id: 0 },
{ name: "Joao", id: 1 },
{ name: "Jean", id: 2 }];


</script>