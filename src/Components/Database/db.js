//------------------------------------------------------------------------------------------------------------//
// Sort Categories
//------------------------------------------------------------------------------------------------------------//
export const callDatabase = async (data) => {
  let catalog = data.catalog[0].categories; // Nike Catalog
  let minCount = 3; // Minimum amount of sub categories to be considered for sorting

  // Catalog Sorting Arrays
  let listItems = [];
  let sortedListItems = [];
  let primaryListItemValues = [];

  //-------------//
  // Create Primary DOM List

  for (let i = 0; i < catalog.length; i++) {
    if (catalog[i].name.toUpperCase() === catalog[i].name) {
      primaryListItemValues.push({ ...catalog[i], catalog: [] });
    } else {
      listItems.push(catalog[i].parent_id); // Every secondaryListItems and under
    }
  }

  //-------------//
  // Start of Sorting categories

  let resetCounter = 0;

  listItems.sort((a, b) => {
    return a + b;
  });

  for (let i = 0; i < listItems.length; i++) {
    // Check if duplicate
    if (listItems[i] === listItems[i + 1]) {
      resetCounter++;

      // Count as duplicate if above minCount
      if (resetCounter >= minCount) {
        sortedListItems.push(listItems[i]);
        resetCounter = 0; // Reset so we only get one number, and not duplicates of the number in the new filtered array
      }
    } else resetCounter = 0;
  }

  //-------------//
  // Filters

  // Filter sortedListItems
  let filteredListItems = sortedListItems.filter(
    (v, i) => sortedListItems.indexOf(v) === i
  );

  // Filter filteredListItems (catalog Items)
  let sortedCatalogItemParents = catalog.filter((category) =>
    filteredListItems.find((parent_id) => parent_id === category.id)
  );

  sort(sortedCatalogItemParents);

  // Filter filteredListItems (catalog Items)
  let sortedCatalogItems = catalog.filter((category) =>
    filteredListItems.find((parent_id) => parent_id === category.parent_id)
  );

  //-------------//
  // Sort primaryListItemValues catalog array

  for (let i = 0; i < sortedCatalogItemParents.length; i++) {
    if (
      primaryListItemValues[0].id <= sortedCatalogItemParents[i].id &&
      primaryListItemValues[1].id >= sortedCatalogItemParents[i].id
    ) {
      primaryListItemValues[0].catalog.push(sortedCatalogItemParents[i]);
    } else if (
      primaryListItemValues[1].id <= sortedCatalogItemParents[i].id &&
      primaryListItemValues[2].id >= sortedCatalogItemParents[i].id
    ) {
      primaryListItemValues[1].catalog.push(sortedCatalogItemParents[i]);
    } else {
      primaryListItemValues[2].catalog.push(sortedCatalogItemParents[i]);
    }
  }

  //-------------//
  // Filter / Sort primaryListItemValues catalog array

  for (let i = 0; i < primaryListItemValues.length; i++) {
    primaryListItemValues[i].catalog = sortParentsDupes(
      primaryListItemValues[i].catalog
    );

    for (let j = 0; j < primaryListItemValues[i].catalog.length; j++) {
      let lists = primaryListItemValues[i].catalog[j].supportingLists;
      let similarities = sortSupportingParentsItems(sortedCatalogItems, lists);
      primaryListItemValues[i].catalog[j] = {
        ...primaryListItemValues[i].catalog[j],
        products: similarities,
      };
    }
  }

  return primaryListItemValues;
};

// Sorts out dupes, and creates a new value on primaryListItemValues, with the suppoorting Values (The dupes)
function sortParentsDupes(primaryList) {
  let sortedParentsList = [];
  let sortedDupeParentsList = [];

  for (let i = 0; i < primaryList.length - 1; i++) {
    // Sort dupelicates from none duplicates
    if (primaryList[i].name === primaryList[i + 1].name) {
      sortedDupeParentsList.push(primaryList[i].id);
    } else {
      sortedDupeParentsList.push(primaryList[i].id);

      sortedParentsList.push({
        ...primaryList[i],
        supportingLists: sortedDupeParentsList,
      });

      sortedDupeParentsList = [];
    }

    // Insurance, if category is too small.
    if (primaryList.length - 1 <= 1) {
      sortedDupeParentsList.push(primaryList[i].id);

      sortedParentsList.push({
        ...primaryList[i],
        supportingLists: sortedDupeParentsList,
      });

      sortedDupeParentsList = [];
    }
  }
  return sortedParentsList;
}

// Sort SupportingParents items into a new children array
function sortSupportingParentsItems(sortedCatalogItems, lists) {
  let similarities = [];
  let returnSimilarities = [];

  for (let key of sortedCatalogItems) {
    if (lists.indexOf(key.parent_id) > -1) {
      similarities.push(key);
    }
  }

  sort(similarities);

  for (let i = 0; i < similarities.length - 1; i++) {
    if (similarities[i].name !== similarities[i + 1].name) {
      returnSimilarities.push(similarities[i]);
    }
  }

  sort(returnSimilarities);

  return returnSimilarities;
}

// Sorting arr, asc order
const sort = (arr) => {
  arr.sort((a, b) => {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  });
};
