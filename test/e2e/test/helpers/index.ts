/**
 * Set the test context
 *
 * @param {object} data
 * @param {object} data.user
 * @param {string} data.user.username
 * @param {string} data.user.password
 * @param {string} data.path
 * @param {array} data.products
 */
/**
 * Assert that no browser alert is currently open.
 * If one is open, accepts it and fails the test with the alert text.
 */
export async function assertNoAlert(): Promise<void> {
  if (await browser.isAlertOpen()) {
    const alertText = await browser.getAlertText();
    await browser.acceptAlert();
    await expect(alertText).toEqual('');
  }
}

export async function setTestContext(data: { path?: string; products?: number[]; user?: { username: string; password: string; } }) {
  const {path, products = [], user} = data;
  const {username} = user;
  const userCookies = `document.cookie="session-username=${username}";`;
  const productStorage = products.length > 0 ? `localStorage.setItem("cart-contents", "[${products.toString()}]");` : '';

  // Go to the domain and set the storage
  await browser.url('');
  await browser.execute(`${userCookies} ${productStorage}`);

  // Now got to the page
  await browser.url(path);
}
