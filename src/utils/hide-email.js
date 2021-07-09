const hideEmail = (email, numberCharacter = 2) => {
    let splitted, part1, part2;
    splitted = email.split("@");
    part1 = splitted[0];
    part1 = part1.substring(0, numberCharacter);
    part2 = splitted[1];
    return part1 + "...@" + part2;
}

export {
    hideEmail
}