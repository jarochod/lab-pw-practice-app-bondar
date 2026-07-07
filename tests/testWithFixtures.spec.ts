import { test } from "../test-options";
import { faker } from "@faker-js/faker";

// s8-ch68 | 68. Fixtures

test("parametrized methods test", async ({ pageManager }) => {

  // Generate random full name using Faker library
  const randomFullName = faker.person.fullName();
  // Generate random valid email
  const randomEmail = `${randomFullName.replace(/ /g, '')}${faker.number.int(100)}@test.com`;

  // High-level abstraction: we focus on "what" we do, not "how"
  await pageManager.onFormLayoutsPage().submitUsingTheGridFormWithCredentialsAndSelectOptions(process.env.USERNAME, process.env.PASSWORD, "Option 2");
  // Reusing the same logic for different test cases
  await pageManager.onFormLayoutsPage().submitInlineFormWithNameEmailAndCheckbox(randomFullName, randomEmail, true);

});
