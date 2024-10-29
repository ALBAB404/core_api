

<script setup>
import { ref, nextTick, computed, defineEmits } from "vue";

const emit = defineEmits(['productVariationPrice']);
const selectedAttributes = ref({});
const isAttributeDisabledUnSelectInitialStage = ref(true); // Changed to true initially
const availableAttributes = ref({});
const attribute_id_1 = ref(null);
const attribute_id_2 = ref(null);
const attribute_id_3 = ref(null);
const attribute_value_id_1 = ref(null);
const attribute_value_id_2 = ref(null);
const attribute_value_id_3 = ref(null);
const productVariationData = ref("");
const productVariationPrice = ref("");
const defaultVariation = ref(null);
const isDefaultLoaded = ref(true); // Changed to true initially

const sendVariationProductPrice = (data) => {
  emit('productVariationPrice', data);
  emit('productVariationData', productVariationData.value);
};

const isSelected = (attributeKey, attributeValue) => {
  return selectedAttributes.value[attributeKey] === attributeValue;
};

// Modified reset function
const resetSelections = () => {
  selectedAttributes.value = {};
  productVariationPrice.value = [];
  productVariationData.value = "";
  attribute_id_1.value = null;
  attribute_id_2.value = null;
  attribute_id_3.value = null;
  attribute_value_id_1.value = null;
  attribute_value_id_2.value = null;
  attribute_value_id_3.value = null;
  isDefaultLoaded.value = false;
  isAttributeDisabledUnSelectInitialStage.value = false; // Set to false to enable all attributes
  sendVariationProductPrice(productVariationPrice.value);
};

const isAnyAttributeSelected = computed(() => {
  return Object.keys(selectedAttributes.value).length > 0;
});

// Initialize available attributes structure
const initializeAvailableAttributes = (variations) => {
  const attributes = {};
  
  variations.forEach(variation => {
    // Handle attribute 1
    if (variation.attribute_value_1) {
      const attr1Name = variation.attribute_value_1.attribute.name;
      const attr1Value = variation.attribute_value_1.value;
      
      if (!attributes[attr1Name]) {
        attributes[attr1Name] = {};
      }
      if (!attributes[attr1Name][attr1Value]) {
        attributes[attr1Name][attr1Value] = [];
      }

      // Add available combinations
      const combination = {};
      if (variation.attribute_value_2) {
        const attr2Name = variation.attribute_value_2.attribute.name;
        const attr2Value = variation.attribute_value_2.value;
        combination[attr2Name] = attr2Value;
      }
      if (variation.attribute_value_3) {
        const attr3Name = variation.attribute_value_3.attribute.name;
        const attr3Value = variation.attribute_value_3.value;
        combination[attr3Name] = attr3Value;
      }

      attributes[attr1Name][attr1Value].push(combination);
    }

    // Handle attribute 2
    if (variation.attribute_value_2) {
      const attr2Name = variation.attribute_value_2.attribute.name;
      const attr2Value = variation.attribute_value_2.value;
      
      if (!attributes[attr2Name]) {
        attributes[attr2Name] = {};
      }
      if (!attributes[attr2Name][attr2Value]) {
        attributes[attr2Name][attr2Value] = [];
      }

      const combination = {};
      if (variation.attribute_value_1) {
        const attr1Name = variation.attribute_value_1.attribute.name;
        const attr1Value = variation.attribute_value_1.value;
        combination[attr1Name] = attr1Value;
      }
      if (variation.attribute_value_3) {
        const attr3Name = variation.attribute_value_3.attribute.name;
        const attr3Value = variation.attribute_value_3.value;
        combination[attr3Name] = attr3Value;
      }
      
      attributes[attr2Name][attr2Value].push(combination);
    }

    // Handle attribute 3
    if (variation.attribute_value_3) {
      const attr3Name = variation.attribute_value_3.attribute.name;
      const attr3Value = variation.attribute_value_3.value;
      
      if (!attributes[attr3Name]) {
        attributes[attr3Name] = {};
      }
      if (!attributes[attr3Name][attr3Value]) {
        attributes[attr3Name][attr3Value] = [];
      }

      const combination = {};
      if (variation.attribute_value_1) {
        const attr1Name = variation.attribute_value_1.attribute.name;
        const attr1Value = variation.attribute_value_1.value;
        combination[attr1Name] = attr1Value;
      }
      if (variation.attribute_value_2) {
        const attr2Name = variation.attribute_value_2.attribute.name;
        const attr2Value = variation.attribute_value_2.value;
        combination[attr2Name] = attr2Value;
      }
      
      attributes[attr3Name][attr3Value].push(combination);
    }
  });

  return attributes;
};

const isPartOfDefaultVariation = (attributeKey, attributeValue) => {
  if (!defaultVariation.value) return true;

  return (
    (defaultVariation.value.attribute_value_1?.attribute.name === attributeKey && 
     defaultVariation.value.attribute_value_1?.value === attributeValue) ||
    (defaultVariation.value.attribute_value_2?.attribute.name === attributeKey && 
     defaultVariation.value.attribute_value_2?.value === attributeValue) ||
    (defaultVariation.value.attribute_value_3?.attribute.name === attributeKey && 
     defaultVariation.value.attribute_value_3?.value === attributeValue)
  );
};

// Modified isAttributeDisabled function
const isAttributeDisabled = (attributeKey, attributeValue) => {
  // If reset was clicked (isAttributeDisabledUnSelectInitialStage is false), enable all attributes
  if (!isAttributeDisabledUnSelectInitialStage.value) {
    return false;
  }

  // If showing default variation and attribute is not part of it
  if (isDefaultLoaded.value && !isPartOfDefaultVariation(attributeKey, attributeValue)) {
    return true;
  }

  // If attribute is already selected
  if (selectedAttributes.value[attributeKey] === attributeValue) {
    return false;
  }

  // Check availability based on current selections
  if (Object.keys(selectedAttributes.value).length > 0) {
    const currentSelections = { ...selectedAttributes.value };
    for (const [selectedKey, selectedValue] of Object.entries(currentSelections)) {
      if (selectedKey === attributeKey) continue;
      
      const availableOptions = availableAttributes.value[selectedKey]?.[selectedValue];
      if (!availableOptions) continue;

      const hasValidCombination = availableOptions.some(option => 
        Object.entries(option).some(([key, value]) => 
          key === attributeKey && value === attributeValue
        )
      );

      if (!hasValidCombination) {
        return true;
      }
    }
  }

  return false;
};

const getVariations = (attributeKey, attributeValue, allVariations, index) => {
  // If in reset state, allow selecting any attribute
  if (!isAttributeDisabledUnSelectInitialStage.value) {
    isAttributeDisabledUnSelectInitialStage.value = true;
  }
  
  if (index === 0) {
    attribute_id_1.value = attributeValue.attribute_id;
    attribute_value_id_1.value = attributeValue.attribute_value_id;
  } else if (index === 1) {
    attribute_id_2.value = attributeValue.attribute_id;
    attribute_value_id_2.value = attributeValue.attribute_value_id;
  } else if (index === 2) {
    attribute_id_3.value = attributeValue.attribute_id;
    attribute_value_id_3.value = attributeValue.attribute_value_id;
  }

  productVariationData.value = {
    attribute_id_1: attribute_id_1.value || "",
    attribute_value_id_1: attribute_value_id_1.value || "",
    attribute_id_2: attribute_id_2.value || "",
    attribute_value_id_2: attribute_value_id_2.value || "",
    attribute_id_3: attribute_id_3.value || "",
    attribute_value_id_3: attribute_value_id_3.value || "",
  };

  if (selectedAttributes.value[attributeKey] === attributeValue.attribute_value) {
    selectedAttributes.value = {};
  } else {
    selectedAttributes.value[attributeKey] = attributeValue.attribute_value;
    availableAttributes.value = initializeAvailableAttributes(allVariations);
  }

  productVariationPrice.value = allVariations.filter((e) => {
    let isMatch = true;

    if (productVariationData.value.attribute_value_id_1) {
      isMatch = isMatch && e.attribute_value_1 && (e.attribute_value_1.id === productVariationData.value.attribute_value_id_1);
    }

    if (productVariationData.value.attribute_value_id_2) {
      isMatch = isMatch && e.attribute_value_2 && (e.attribute_value_2.id === productVariationData.value.attribute_value_id_2);
    }

    if (productVariationData.value.attribute_value_id_3) {
      isMatch = isMatch && e.attribute_value_3 && (e.attribute_value_3.id === productVariationData.value.attribute_value_id_3);
    }

    return isMatch;
  });

  sendVariationProductPrice(productVariationPrice.value);
  console.log(availableAttributes.value)
  
};

const getIsDefaultAttribute = (allVariations) => {
  const defaultAttributes = allVariations.filter(e => e.is_default);
  
  if (defaultAttributes.length > 0) {
    defaultVariation.value = defaultAttributes[0];
    productVariationPrice.value = defaultAttributes;
    sendVariationProductPrice(productVariationPrice.value);
    
    selectedAttributes.value = {};
    
    if (defaultVariation.value.attribute_value_1) {
      selectedAttributes.value[defaultVariation.value.attribute_value_1.attribute.name] = 
        defaultVariation.value.attribute_value_1.value;
      attribute_id_1.value = defaultVariation.value.attribute_value_1.attribute.id;
      attribute_value_id_1.value = defaultVariation.value.attribute_value_1.id;
    }
    if (defaultVariation.value.attribute_value_2) {
      selectedAttributes.value[defaultVariation.value.attribute_value_2.attribute.name] = 
        defaultVariation.value.attribute_value_2.value;
      attribute_id_2.value = defaultVariation.value.attribute_value_2.attribute.id;
      attribute_value_id_2.value = defaultVariation.value.attribute_value_2.id;
    }
    if (defaultVariation.value.attribute_value_3) {
      selectedAttributes.value[defaultVariation.value.attribute_value_3.attribute.name] = 
        defaultVariation.value.attribute_value_3.value;
      attribute_id_3.value = defaultVariation.value.attribute_value_3.attribute.id;
      attribute_value_id_3.value = defaultVariation.value.attribute_value_3.id;
    }
    
    isDefaultLoaded.value = true;
    isAttributeDisabledUnSelectInitialStage.value = true;
    availableAttributes.value = initializeAvailableAttributes(allVariations);
  }
};

const props = defineProps({
  productVariations: Object,
  allVariations: Array,
  required: true,
});

nextTick(() => {
  getIsDefaultAttribute(props.allVariations);
});
</script>

<template>
  <span v-if="productVariations" class="mb-5">
    <div
      class="details-list-group"
      v-for="(attribute, key, index) in productVariations"
      :key="index"
    >
      <label class="details-list-title">{{ key }}</label>
      <ul class="details-tag-list">
        <li
          v-for="(attributeValue, indexAttributeValue) in attribute"
          :key="indexAttributeValue"
        >
          <a
            href="#"
            :class="{
              'is-active': !isAttributeDisabled(key, attributeValue.attribute_value) && isSelected(key, attributeValue.attribute_value),
              'is-disabled': isAttributeDisabled(key, attributeValue.attribute_value) && isAttributeDisabledUnSelectInitialStage
            }"
            @click.prevent="!isAttributeDisabled(key, attributeValue.attribute_value) && getVariations(key, attributeValue, allVariations, index)"
          >
            {{ attributeValue.attribute_value }}
          </a>
        </li>
      </ul>
    </div>
    <button v-if="isAnyAttributeSelected" @click="resetSelections" class="reset-btn">
      Reset
    </button>
  </span>
</template>

<style scoped>
@import "@/assets/css/product-details.css";

.reset-btn {
  cursor: pointer;
  border: 1px solid red;
  padding: 5px 10px;
  border-radius: 5px;
  background-color: red;
  color: white;
}

.is-active {
  color: var(--white) !important;
  background-color: var(--secondary-color) !important;
}

.is-disabled {
  background: rgb(199, 40, 40);
  color: white;
  border: 0;
  cursor: pointer;
  padding: 1em;
  opacity: 0.5;
  cursor: not-allowed;
}
</style>




