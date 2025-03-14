// import des bibliothèques
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import argon2 from "argon2";
// import des entités
import { User } from "../entities/auth/User";
// import des type
import type { StrategyOptionsWithoutRequest } from "passport-jwt";

const secretJWtKey = process.env.JWT_SECRET;

// utilisation de la stratégie Local pour rechercher l'utilisateur dans la BDD
passport.use(
	new LocalStrategy(async (username, password, done) => {
		try {
			const user = await User.findOne({ where: { username } });
			// si l'utilisateur n'est pas trouvé
			if (!user)
				return done(null, false, { message: "Utilisateur non trouvé" });

			// si le mot de passe ne correspond pas
			const isMatch = await argon2.verify(password, user.password);
			if (!isMatch)
				return done(null, false, { message: "Mot de passe incorrect" });

			// sinon
			return done(null, user);
		} catch (error) {
			done(error);
		}
	}),
);

// utilisation de la stratégie JWT pour vérifier le token
const jwtOptions: StrategyOptionsWithoutRequest = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: secretJWtKey as string,
};

passport.use(
	new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
		try {
			const user = await User.findOneBy({ id: jwtPayload.userId });
			if (user) return done(null, user);
			return done(null, false);
		} catch (error) {
			return done(error, false);
		}
	}),
);

export default passport;
