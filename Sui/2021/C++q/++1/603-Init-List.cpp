#include <iostream>
#include <sstream>

struct KS_base {  };
struct KS;
struct App
{
	App();
	KS_base * ks;
};

struct KS : public KS_base
{
	KS( App * app ) : app( * app ) {}
	App & app;
};

App::App() { ks = new KS { this }; }


int main()
{
	std::cout << "oyu 12";
	return 0;
}
