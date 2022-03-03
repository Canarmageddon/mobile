import Cart from '../cart_test';
import {getWindowSize} from '../App';

test("when adding an item, the card size is increased", () => {
    //Arrange
    const size = getWindowSize();

    //Assert
    expect(size).toBe("width : 100, height : 50");
})