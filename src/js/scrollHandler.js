export const setupScrollHandler = () => {
    const sideBarWrapper = document.querySelector(".sidebar-wrapper");
    const header = document.querySelector(".header");
    const promoOne = document.querySelector(".promo-one");
    const promoTwo = document.querySelector(".promo-two");

    const asideScrollFix = () => {
        const isScrollDown = window.scrollY > 0;
        const sideBarWrapperRect = sideBarWrapper.getBoundingClientRect();
        const promoOneRect = promoOne.getBoundingClientRect();
        const promoTwoRect = promoTwo.getBoundingClientRect();

        if (isScrollDown && sideBarWrapperRect.top < 110) {
            sideBarWrapper.style.position = "fixed";
            sideBarWrapper.style.top = `${header.offsetHeight}px`;
        } else {
            sideBarWrapper.style.position = "absolute";
            sideBarWrapper.style.top = "840px";
        }

        promoOne.style.display = isScrollDown && promoOneRect.top < 110 ? "none" : "block";
        promoTwo.style.display = isScrollDown && promoTwoRect.top < 110 ? "none" : "block";
    };

    window.addEventListener("scroll", asideScrollFix);
};