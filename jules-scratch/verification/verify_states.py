from playwright.sync_api import sync_playwright, Page, expect

def run(page: Page):
    # Go to the products page
    page.goto("http://localhost:5173/ong/products")

    # Mock the API to return an error
    page.route("**/products", lambda route: route.abort())
    page.goto("http://localhost:5173/ong/about")
    page.goto("http://localhost:5173/ong/products")


    # Capture the error state
    expect(page.locator(".alert-danger")).to_be_visible()
    page.screenshot(path="jules-scratch/verification/01_error-state.png")

    # Mock the API to return an empty list of products
    page.unroute("**/products")
    page.route("**/products", lambda route: route.fulfill(json={"products": []}))
    page.goto("http://localhost:5173/ong/about")
    page.goto("http://localhost:5173/ong/products")

    # Capture the empty state
    expect(page.get_by_text("Nenhum produto encontrado.")).to_be_visible()
    page.screenshot(path="jules-scratch/verification/02_empty-state.png")

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        run(page)
        browser.close()

if __name__ == "__main__":
    main()
