async function selectOptionByText(page, name, optionText) {
	const optionWaned = (
		await page.$x(`//*[@name = "${name}"]/option[text() = "${optionText}"]`)
	)[0];

	const optionValue = await (
		await optionWaned.getProperty('value')
	).jsonValue();

	return await page.select(`[name=${name}`, optionValue);
}

function containsText(page, selector, expected) {
	const res = page.evaluate(
		(selector, expected) => {
			return document
				.querySelector(selector)
				.innerText.toLowerCase()
				.includes(expected);
		},
		selector,
		expected
	);
	return res;
}

module.exports = {
	containsText,
	selectOptionByText,
};
