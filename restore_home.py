
path = r'c:\Users\HP\Desktop\MISHAEL_SEMA_EKOM\Websites\GLOBALTRACK\global-track-courier\src\pages\Home.tsx'

with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

# The mess starts before the first "export default Home;"
split_marker = 'export default Home;'
parts = text.split(split_marker)

# We take the first part which is the "mostly clean" original
clean_start = parts[0]

# Now we need to make sure the Global Branches section is in the right place (between Why Choose Us and How It Works)
# Why Choose Us ends around line 316 in the original.
# How It Works starts around line 356 in the original.

# Let's find "Why Choose Us" end and "How It Works" start in clean_start
wcu_end_marker = '{/* Why Choose Us Section */}'
hiw_start_marker = '{/* How It Works Section */}'

wcu_pos = clean_start.find(wcu_end_marker)
hiw_pos = clean_start.find(hiw_start_marker)

# If comments aren't there, look for section headers
if wcu_pos == -1: wcu_pos = clean_start.find('Why Choose Zip Xpress')
if hiw_pos == -1: hiw_pos = clean_start.find('How It Works at Zip Xpress')

# Find the div closing after WCU
# WCU section is roughly:
# <div py-16> ... </div>
# Let's find the closing layer for the WCU section.
# In the original, WCU section was lines 260-316.
# So it ends after the 4th AnimatedCard.

wcu_section_end = clean_start.find('</div>\n            </AnimatedCard>\n          </div>\n        </div>\n      </div>', wcu_pos)
if wcu_section_end == -1:
    # fallback to just searching for enough closing divs if it doesn't match exactly
    pass

# Actually, I'll just find where "Why Choose Us" section's main div ends.
# It starts with <div className="py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
# And it ends several levels deep.

marquee_section = """
      {/* Global Branches Section */}
      <div className="py-16 bg-white dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedCard animation="fade">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold text-zip-blue-800 dark:text-white sm:text-4xl">
                Zip Xpress Global Branches and WareHouses
              </h2>
              <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
                Strategic locations across key international logistics hubs to serve you better.
              </p>
            </div>
          </AnimatedCard>

          <div className="mt-8">
            <GlobalBranches variant="marquee" />
          </div>
        </div>
      </div>
"""

# Let's rebuild the file from the early bits I know are good.
# I'll just find the "How It Works" start and insert before it.

final_hiw_pos = clean_start.find('How It Works')
# backup to the start of that section's div
section_hiw_start = clean_start.rfind('<div className="py-16 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-900">', 0, final_hiw_pos)

if section_hiw_start != -1:
    reconstructed = clean_start[:section_hiw_start] + marquee_section + clean_start[section_hiw_start:]
    # Now close the component correctly
    reconstructed += "\n    </div>\n  );\n};\n\nexport default Home;\n"
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(reconstructed)
    print("Home.tsx restored and marquee integrated successfully")
else:
    print("Failing: Could not find How It Works section to insert marquee")
